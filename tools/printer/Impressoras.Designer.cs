namespace DeskTools
{
    partial class Impressoras
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            label1 = new Label();
            CboImpressora = new ComboBox();
            BtnConfirmar = new Button();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI", 9.75F, FontStyle.Regular, GraphicsUnit.Point, 0);
            label1.Location = new Point(15, 50);
            label1.Margin = new Padding(4, 0, 4, 0);
            label1.Name = "label1";
            label1.Size = new Size(74, 17);
            label1.TabIndex = 0;
            label1.Text = "Impressora";
            // 
            // CboImpressora
            // 
            CboImpressora.DropDownStyle = ComboBoxStyle.DropDownList;
            CboImpressora.FlatStyle = FlatStyle.Flat;
            CboImpressora.Font = new Font("Segoe UI", 9.75F, FontStyle.Regular, GraphicsUnit.Point, 0);
            CboImpressora.FormattingEnabled = true;
            CboImpressora.Location = new Point(108, 46);
            CboImpressora.Margin = new Padding(4, 3, 4, 3);
            CboImpressora.Name = "CboImpressora";
            CboImpressora.Size = new Size(332, 25);
            CboImpressora.TabIndex = 1;
            // 
            // BtnConfirmar
            // 
            BtnConfirmar.BackColor = Color.Aquamarine;
            BtnConfirmar.Cursor = Cursors.Hand;
            BtnConfirmar.FlatAppearance.BorderColor = Color.SeaGreen;
            BtnConfirmar.FlatStyle = FlatStyle.Flat;
            BtnConfirmar.Font = new Font("Segoe UI", 9.75F, FontStyle.Regular, GraphicsUnit.Point, 0);
            BtnConfirmar.Location = new Point(320, 119);
            BtnConfirmar.Margin = new Padding(4, 3, 4, 3);
            BtnConfirmar.Name = "BtnConfirmar";
            BtnConfirmar.Size = new Size(120, 37);
            BtnConfirmar.TabIndex = 2;
            BtnConfirmar.Text = "Confirmar";
            BtnConfirmar.UseVisualStyleBackColor = false;
            BtnConfirmar.Click += BtnConfirmar_Click;
            // 
            // Impressoras
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(454, 168);
            Controls.Add(BtnConfirmar);
            Controls.Add(CboImpressora);
            Controls.Add(label1);
            FormBorderStyle = FormBorderStyle.FixedSingle;
            Margin = new Padding(4, 3, 4, 3);
            MaximizeBox = false;
            MinimizeBox = false;
            Name = "Impressoras";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Imprimir";
            Load += Impressoras_Load;
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox CboImpressora;
        private System.Windows.Forms.Button BtnConfirmar;
    }
}