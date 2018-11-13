using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Data
{
   public class Entity
    {
        public Entity()
        {
            Guid = Guid.NewGuid();
            CreationDate= DateTime.Now;
            IsActive = true;
        }
        [Key]
        public long Id { get; set; }
        public Guid Guid { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid ModifiedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
