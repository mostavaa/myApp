using System;
using System.Collections.Generic;
using System.Text;

namespace Data
{
  public class ProductImages
  {
    public ProductImages()
    {
      Guid = Guid.NewGuid();
    }
    public long Id { get; set; }
    public Guid Guid { get; set; }
    public string Name { get; set; }
    public long ProductId { get; set; }
    public Product Product { get; set; }
  }
}
