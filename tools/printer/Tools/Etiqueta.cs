using System.Text;

namespace DeskTools.Tools
{
    public class Etiqueta
    {
        
        private static Impressoras Impressora { get; set; } = new Impressoras();

        public static void Imprimir(string? szString)
        {

            Impressora.szStringPrinter = szString;

            Impressora.OnConfirm += Confirmar;

            Impressora.ShowDialog();
            
        }

        private static void Confirmar(string szPrintName, string szString)
        {

            byte[] data = Convert.FromBase64String(szString);
            string decodedString = Encoding.UTF8.GetString(data);

            var b = RawPrinterHelper.SendStringToPrinter(szPrintName, decodedString);

            Impressora.Close();

        }

    }
}