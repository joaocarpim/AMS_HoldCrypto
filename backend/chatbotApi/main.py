import httpx
import os
import re
import uvicorn
from fastapi import FastAPI, Request, HTTPException, status
from pydantic import BaseModel

# Gateway URL
GATEWAY_BASE = "http://localhost:5026" 

app = FastAPI(title="Chatbot API") 

class MessageRequest(BaseModel):
    message: str

@app.post("/chatbot/message")
async def handle_message(request: Request, msg_request: MessageRequest):
    user_message = msg_request.message.strip()
    
    # Validação do Token
    auth_header = request.headers.get("Authorization")
    token = ""
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    print(f"-------- NOVA MENSAGEM: '{user_message}' --------")

    # ======================================================================
    # REGEX (CÉREBRO)
    # ======================================================================
    cotacao_match = re.search(r"(cotação|preço|valor|quanto\s+tá|quanto\s+custa)\s+(do\s+|da\s+|de\s+|o\s+|a\s+)?(\w+)", user_message, re.IGNORECASE)
    depositar_match = re.search(r"depositar\s+(\d+([.,]\d+)?)\s+(\w+)", user_message, re.IGNORECASE)
    saldo_especifico_match = re.search(r"(saldo|quanto tenho)\s+(de\s+)?(\w+)", user_message, re.IGNORECASE)
    saldo_geral_match = re.search(r"saldo", user_message, re.IGNORECASE)

    # ======================================================================
    # Cenario A: CONSULTAR COTAÇÃO (FIX: BUSCA LISTA COMPLETA)
    # ======================================================================
    if cotacao_match:
        symbol = cotacao_match.group(3).upper() 
        print(f"[DEBUG] Buscando cotação para: {symbol}")
        
        try:
            async with httpx.AsyncClient() as client:
                # FIX: Chama a rota que lista TUDO (GET /api/currency)
                # Assim evitamos o erro 400 de buscar por ID
                url = f"{GATEWAY_BASE}/api/currency"
                print(f"[DEBUG] Baixando lista completa: {url}")
                
                response = await client.get(url, timeout=5.0)

            print(f"[DEBUG] Status Code: {response.status_code}")

            if response.status_code == 200:
                lista_moedas = response.json()
                
                # Procura a moeda na lista (Python filter)
                # Tenta achar onde 'symbol' é igual ao que o usuário pediu
                moeda_encontrada = next((m for m in lista_moedas if m.get('symbol', '').upper() == symbol), None)

                if moeda_encontrada:
                    # Pega o preço (pode estar dentro de 'histories' ou direto)
                    price = 0
                    
                    # Lógica para achar o preço no JSON da sua API
                    if 'price' in moeda_encontrada:
                        price = moeda_encontrada['price']
                    elif 'Price' in moeda_encontrada:
                        price = moeda_encontrada['Price']
                    elif 'histories' in moeda_encontrada and len(moeda_encontrada['histories']) > 0:
                        # Pega o último histórico
                        # Ordena ou pega o último da lista
                        historicos = moeda_encontrada['histories']
                        price = historicos[-1].get('price', 0)

                    name = moeda_encontrada.get('name', symbol)
                    
                    if price == 0:
                         return {"response": f"⚠️ Encontrei '{name}', mas o preço está zerado."}

                    return {"response": f"📈 **{name} ({symbol})**\nPreço atual: **R$ {price:,.2f}**"}
                else:
                    return {"response": f"❌ Não encontrei a moeda '{symbol}' na lista de ativos."}
            
            else:
                return {"response": f"⚠️ Erro {response.status_code} ao consultar mercado."}
                
        except Exception as e:
            print(f"[ERRO CRÍTICO] {e}")
            return {"response": "⚠️ Erro de conexão com o serviço de Cotações."}

    # ======================================================================
    # Cenario B: DEPOSITAR (Mantido)
    # ======================================================================
    elif depositar_match:
        if not token: return {"response": "🔒 Você precisa estar logado para depositar."}

        amount_str = depositar_match.group(1).replace(',', '.')
        currency_code = depositar_match.group(3).upper()
        
        try:
            amount = float(amount_str)
        except:
            return {"response": "❌ Valor inválido."}

        deposit_data = { "amount": amount, "currencyCode": currency_code }

        try:
            async with httpx.AsyncClient() as client:
                url = f"{GATEWAY_BASE}/api/Wallet/chatbot/deposit"
                response = await client.post(url, json=deposit_data, headers=headers)

            if response.status_code == 200:
                return {"response": f"✅ Feito! Depositei {amount} {currency_code}."}
            elif response.status_code == 404:
                return {"response": f"❌ Você não tem uma carteira de {currency_code}."}
            else:
                try:
                    err = response.json().get('message') or response.text
                except:
                    err = response.text
                return {"response": f"⚠️ Falha: {err}"}
        except Exception as e:
            print(f"Erro Deposito: {e}")
            return {"response": "Erro de conexão com a WalletAPI."}

    # ======================================================================
    # Cenario C: SALDO GERAL / ESPECÍFICO (Simplificado)
    # ======================================================================
    elif "SALDO" in user_message.upper() or "QUANTO TENHO" in user_message.upper():
        if not token: return {"response": "🔒 Faça login para ver seu saldo."}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{GATEWAY_BASE}/api/Wallet/balance", headers=headers)

            if response.status_code == 200:
                data = response.json()
                total = data.get('totalBalanceBRL', 0.0)
                
                # Se pediu moeda específica
                match_spec = re.search(r"(saldo|quanto tenho)\s+(de\s+)?(\w+)", user_message, re.IGNORECASE)
                if match_spec:
                    target = match_spec.group(3).upper()
                    if target not in ["TOTAL", "GERAL"]:
                        assets = data.get('assets', [])
                        found = next((a for a in assets if a['symbol'] == target), None)
                        if found:
                            return {"response": f"🪙 **{target}**: {found['amount']}\n(≈ R$ {found['currentPriceBRL'] * found['amount']:,.2f})"}
                        else:
                            return {"response": f"🔍 Você não tem saldo em {target}."}

                return {"response": f"💰 Patrimônio Total Estimado:\n**R$ {total:,.2f}**"}
            else:
                return {"response": f"❌ Erro ao buscar saldo."}
        except:
            return {"response": "Erro de conexão."}

    # ======================================================================
    # Cenario E: AJUDA
    # ======================================================================
    return {"response": "🤖 Tente:\n- 'Preço BTC'\n- 'Cotação ETH'\n- 'Qual meu saldo?'\n- 'Depositar 100 BRL'"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5005)