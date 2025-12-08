using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace walletApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrencySymbolToWallet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrencySymbol",
                table: "Wallets",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrencySymbol",
                table: "Wallets");
        }
    }
}
