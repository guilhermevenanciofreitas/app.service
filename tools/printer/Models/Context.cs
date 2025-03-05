using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agitex.Etiquetas.Models
{
    public class Context : DbContext, IDisposable
    {

        public DbSet<ImpressaoEtiqueta> ImpressaoEtiqueta { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=192.168.1.103;Database=GlobalTCL;User Id=sa;Password=Tcldatabase@01");
        }

    }
}
