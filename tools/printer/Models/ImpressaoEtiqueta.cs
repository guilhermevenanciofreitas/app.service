using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Agitex.Etiquetas.Models
{

    [Serializable()]
    [Table("ImpressaoEtiqueta")]
    public class ImpressaoEtiqueta
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? ID { get; set; }

        public byte[] Impressao { get; set; }

    }
}