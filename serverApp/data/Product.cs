using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Data
{
  public class Product : Entity
  {

    public long DepartmentId { get; set; }

    public Department Department { get; set; }


    public string Name { get; set; }
    public string NameAr { get; set; }

    public string Description { get; set; }
    public string DescriptionAr { get; set; }

    public string PictureContent { get; set; }

    public int Price { get; set; }

    public float Rate { get; set; }

    public int Likes { get; set; }

    public ICollection<ProductImages> Images{ get; set; }
    [NotMapped]
    public List<string> Pictures { get; set; }

  }
}
