using System;
using System.Drawing.Printing;
using System.Windows.Forms;
using System.ComponentModel;

namespace DeskTools
{
    public partial class Impressoras : Form
    {

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        public string? szStringPrinter { get; set; }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        public Action<string, string>? OnConfirm { get; set; }

        public Impressoras()
        {
            InitializeComponent();
        }

        private void Impressoras_Load(object sender, EventArgs e)
        {

            CboImpressora.Items.Clear();

            CboImpressora.Items.Add("[Selecione]");

            foreach (string impressora in PrinterSettings.InstalledPrinters)
            {
                CboImpressora.Items.Add(impressora);
            }

            CboImpressora.SelectedIndex = 0;
            
        }

        private void BtnConfirmar_Click(object sender, EventArgs e)
        {

            if (CboImpressora.SelectedIndex == 0)
            {
                MessageBox.Show("Informe a impressora", "Ops!", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                CboImpressora.Focus();
                return;
            }

            OnConfirm?.Invoke(CboImpressora.Text, szStringPrinter);

        }

    }
}