using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Data;
using Data.Repositories;
using Microsoft.Extensions.Localization;
using serverApp.ViewModels;
using static System.Net.Mime.MediaTypeNames;

namespace serverApp.Models.Business
{
  public interface IProductsBusiness
  {
    ReturnResponse DeleteProduct(Guid id);
    ReturnResponse UpdateProduct(Guid id, Product product);
    ReturnResponse AddProduct(Guid deptGuid, Product product);
    ReturnResponse GetProducts(Guid? deptId, int page);
    ReturnResponse GetProduct(Guid id);
  }
  public class ProductsBusiness : IProductsBusiness
  {
    private readonly IDepartmentsBusiness departmentsBusiness;
    private IUnitOfWork UnitOfWork { get; set; }
    private IStringLocalizer<SharedResources> Localizer { get; }
    private List<string> Errors { get; set; }

    public ProductsBusiness(IUnitOfWork unitOfWork, IDepartmentsBusiness DepartmentsBusiness, IStringLocalizer<SharedResources> localizer)
    {
      UnitOfWork = unitOfWork;
      departmentsBusiness = DepartmentsBusiness;
      Localizer = localizer;
      Errors = new List<string>();
    }
    private bool IsValid(Product product, Guid deptGuid)
    {

      Errors = new List<string>();

      var department = UnitOfWork.DepartmentRepository.GetByGuid(deptGuid);
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
        if (product.Id != 0)
        {
          foreach (var item in UnitOfWork.ProductImagesRepository.GetProductImages(product.Id))
          {
            if (!product.Pictures.Any(o => o.Contains(item.Name)))
            {
              UnitOfWork.ProductImagesRepository.DeleteImage(item.Id);
              UnlinkImage(item.Name);
            }
          }
        }

      }

      return Errors.Count == 0;
    }
    private void UnlinkImage(string str)
    {
      var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/assets/uploads/products", str);
      if (File.Exists(path))
        System.IO.File.Delete(path);
    }
    private void SaveImages(Product product)
    {
      if (product.Images == null)
        product.Images = new List<ProductImages>();
      int counter = 1;
      foreach (var item in product.Pictures.Where(o => o.Length > 200))
      {
        string fileName = product.Guid + DateTime.Now.ToString("yyyy-MM-dd-h-m-s") + "_" + counter + ".png";
        if (counter == 1) product.PictureContent = fileName;
        var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/assets/uploads/products", fileName);
        try
        {
          System.IO.FileInfo file = new System.IO.FileInfo(path);
          file.Directory.Create();
          var base64Data = Regex.Match(item, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
          System.IO.File.WriteAllBytes(file.FullName, Convert.FromBase64String(base64Data));
        }
        catch (Exception e)
        {

          throw;
        }
        product.Images.Add(new ProductImages()
        {
          Name = fileName
        });
        counter++;
      }
    }

    public ReturnResponse DeleteProduct(Guid id)
    {
      Product product = UnitOfWork.ProductRepository.GetByGuid(id);
      if (product != null)
      {
        foreach (ProductImages image in UnitOfWork.ProductImagesRepository.GetProductImages(product.Id))
        {
          UnitOfWork.ProductImagesRepository.DeleteImage(image.Id);
          UnlinkImage(image.Name);
        }
        UnitOfWork.ProductRepository.DeleteProduct(product.Id);
        try
        {
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return new ReturnResponse() { status = false, messages = new string[] { Localizer["ServerError"] } };
        }
        return new ReturnResponse() { status = true, messages = new string[] { Localizer["DeletedSuccessfully"] } };
      }
      else
      {
        return new ReturnResponse() { status = false, messages = new string[] { Localizer["NoProductExist"] } };
      }
    }

    public ReturnResponse UpdateProduct(Guid id, Product product)
    {
      var obj = UnitOfWork.ProductRepository.GetByGuid(id);
      if (obj == null)
      {
        return new ReturnResponse { status = false, messages = new string[] { Localizer["NoProductExist"] } };
      }
      obj.Name = product.Name;
      obj.NameAr = product.NameAr;
      obj.Price = product.Price;
      obj.Description = product.Description;
      obj.DescriptionAr = product.DescriptionAr;
      obj.Pictures = product.Pictures;
      if ((IsValid(obj, obj.Department.Guid)))
      {
        try
        {
          SaveImages(obj);
          UnitOfWork.Commit();
        }
        catch (Exception)
        {
          return new ReturnResponse() { status = false, messages = new string[] { Localizer["ServerError"] } };
        }
        return new ReturnResponse() { status = true, messages = new string[] { Localizer["UpdatedSuccessfully"] } };
      }
      return new ReturnResponse() { status = false, messages = Errors.ToArray() };
    }

    public ReturnResponse AddProduct(Guid deptGuid, Product product)
    {
      try
      {
        if (IsValid(product, deptGuid))
        {
          UnitOfWork.ProductRepository.AddProduct(product);
          try
          {
            SaveImages(product);
            UnitOfWork.Commit();
          }
          catch (Exception e)
          {
            return (new ReturnResponse() { status = false, messages = new string[] { Localizer["ServerError"], e.Message } });
          }
          return (new ReturnResponse() { status = true, data = new { id = product.Guid }, messages = new string[] { Localizer["AddedSuccessfully"] } });
        }
        return (new ReturnResponse() { status = false, messages = Errors.ToArray() });
      }
      catch (Exception e)
      {
        return (new ReturnResponse() { status = false, messages = new string[] { Localizer["ServerError"], e.Message } });
      }
    }

    public ReturnResponse GetProducts(Guid? deptId, int page)
    {
      var result = new List<object>();
      List<Product> objects;
      List<long> depts = new List<long>();
      if (deptId != null)
      {
        var department = UnitOfWork.DepartmentRepository.GetByGuid(deptId.Value);
        if (department != null)
        {
          depts = departmentsBusiness.GetDepartmentChildrenIds(department.Id);
          depts.Add(department.Id);
        }
      }

      if (deptId != null)
        objects = UnitOfWork.ProductRepository.GetDepartmentsProducts(depts, page, Constants.pageSize);
      else
        objects = UnitOfWork.ProductRepository.GetAll(page, Constants.pageSize);
      foreach (var obj in objects)
      {
        result.Add(new { obj.Name, obj.NameAr, obj.DescriptionAr, obj.Description, obj.Price, obj.Likes, obj.Rate, obj.Guid, departmentGuid = obj.Department.Guid, picture = obj.PictureContent });
      }
      int count = deptId != null ? UnitOfWork.ProductRepository.GetDepartmentsProductsCount(depts) : UnitOfWork.ProductRepository.GetCount();
      return (new ReturnResponse() { status = true, data = new { result, count } });
    }

    public ReturnResponse GetProduct(Guid id)
    {
      var obj = UnitOfWork.ProductRepository.GetByGuid(id);
      if (obj != null)
        return (new ReturnResponse() { status = true, data = new { obj.Name, obj.NameAr, obj.DescriptionAr, obj.Description, obj.Price, obj.Likes, obj.Rate, obj.Guid, departmentGuid = obj.Department.Guid, picture = obj.PictureContent, pictures = UnitOfWork.ProductImagesRepository.GetProductImages(obj.Id).Select(o => o.Name).ToList() } });
      else

        return (new ReturnResponse() { status = false, messages = new string[] { Localizer["NoProductExist"] } });
    }
  }
}
