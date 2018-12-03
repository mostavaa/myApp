using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using serverApp.Controllers;
using Data;
using Data.Repositories;
using Microsoft.Extensions.Localization;

namespace serverApp.Models.Business
{
  public interface IProductsBusiness
  {
    IUnitOfWork UnitOfWork { get; set; }
    List<string> Errors { get; set; }
    bool IsValid(Product product, Guid deptGuid);
  }
  public class ProductsBusiness : IProductsBusiness
  {
    public IUnitOfWork UnitOfWork { get; set; }
    public IStringLocalizer<SharedResources> Localizer { get; }

    public ProductsBusiness(IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> localizer)
    {
      UnitOfWork = unitOfWork;
      Localizer = localizer;
      Errors = new List<string>();
    }

    public List<string> Errors { get; set; }
    public bool IsValid(Product product, Guid deptGuid)
    {

      Errors = new List<string>();

      var department = UnitOfWork.DepartmentRepository.Get(o => o.Guid == deptGuid).FirstOrDefault();
      if (department == null)
        Errors.Add(Localizer["DepartmentNotExsist"]);
      else
        product.DepartmentId = department.Id;

      if (string.IsNullOrEmpty(product.Name))
        Errors.Add(Localizer["NameIsNull"]);
      if (product.Name.Length < 3)
        Errors.Add(Localizer["NameIsNull"]);

      if (string.IsNullOrEmpty(product.Description))
        Errors.Add(Localizer["DescriptionIsNull"]);
      if (product.Description.Length < 3)
        Errors.Add(Localizer["DescriptionIsNull"]);

      if (product.Price <= 0)
        Errors.Add(Localizer["PriceNotValid"]);


      if (product.Pictures.Count < 0 || product.Pictures.Count > 6)
        Errors.Add(Localizer["PictureIsNull"]);
      foreach (var item in product.Pictures)
      {
        var imageBytes = Encoding.ASCII.GetBytes(item);
        if (imageBytes.Length > 10485760)
          Errors.Add(Localizer["FileSizeError"]);
      }
      if (Errors.Count == 0)
      {
        foreach (var item in product.Images)
        {
          UnitOfWork.ProductImagesRepository.Delete(item.Id);
        }
        product.PictureContent = product.Pictures.First();
        product.Images = new List<ProductImages>();
        foreach (var item in product.Pictures)
        {
          product.Images.Add(new ProductImages()
          {
            Name = item
          });
        }
      }

      return Errors.Count == 0;
    }


  }
}
