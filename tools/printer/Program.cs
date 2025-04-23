using DeskTools.Tools;
using printer;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Forms;

namespace DeskTools
{
    static class Program
    {
        /// <summary>
        /// Ponto de entrada principal para o aplicativo.
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            try
            {

                /*
                args = new string[1];
                args[0] = "tools.printer:?tag=STgsQSwwMDENCg0KDQpRMjcyLDAyNA0KcTgzMQ0Kck4NClM0DQpEOQ0KWlQNCkpGDQpPRA0KUjE2MCwwDQpmMTAwDQpODQpCMTAwLDI0LDAsMSwyLDYsNTUsQiwiMTA0OTA1MTEwMDE0Nzc3OCINCkE1NSwxMTUsMCwxLDIsMixOLCItIFBPTlRBIEVJWE8gTC9FICAgICAgIg0KQTM2MywxODMsMCwyLDEsMSxOLCJOw612ZWwiDQpBMzgyLDIwMCwwLDEsMiwyLE4sIiINCkEyMjUsMTg0LDAsMiwxLDEsTiwiTGFkbyINCkEyMzksMjAwLDAsMSwyLDIsTiwiICINCkE1MywxODMsMCwyLDEsMSxOLCJQb3Npw6fDo28iDQpBODgsMjAwLDAsMSwyLDIsTiwiIg0KUDEsMDAwMA0K";
                */

                if (args.Length != 0)
                {

                    Uri myUri = new(args[0]);

                    var tag = HttpUtility.ParseQueryString(myUri.Query).Get("tag");

                    Etiqueta.Imprimir(tag);

                }
                else
                {
                    Application.EnableVisualStyles();
                    Application.SetCompatibleTextRenderingDefault(false);
                    Application.Run(new Form1());
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Ops!", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }
    }
}