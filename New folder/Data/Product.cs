using System;
using System.Collections.Generic;
using System.Text;

namespace Data
{
    public class Product: Entity
    {

        public long DepartmentId { get; set; }

        public Department Department { get; set; }


        public string Name { get; set; }

        public string Description { get; set; }

        public string PictureContent { get; set; }

        public int Price { get; set; }

        public float Rate { get; set; }

        public int Likes { get; set; }

    }
}
