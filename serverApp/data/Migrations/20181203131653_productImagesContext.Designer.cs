﻿// <auto-generated />
using System;
using Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace data.Migrations
{
    [DbContext(typeof(ClothesContext))]
    [Migration("20181203131653_productImagesContext")]
    partial class productImagesContext
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Data.AppUser", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid?>("CreatedBy");

                    b.Property<DateTime?>("CreationDate");

                    b.Property<Guid>("Guid");

                    b.Property<bool>("IsActive");

                    b.Property<string>("Mail");

                    b.Property<DateTime?>("ModificationDate");

                    b.Property<Guid?>("ModifiedBy");

                    b.Property<string>("Password");

                    b.Property<string>("Username");

                    b.HasKey("Id");

                    b.ToTable("AppUsers");
                });

            modelBuilder.Entity("Data.Department", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid?>("CreatedBy");

                    b.Property<DateTime?>("CreationDate");

                    b.Property<string>("DeptName");

                    b.Property<string>("DeptNameAr");

                    b.Property<Guid>("Guid");

                    b.Property<bool>("IsActive");

                    b.Property<DateTime?>("ModificationDate");

                    b.Property<Guid?>("ModifiedBy");

                    b.Property<int>("NumberOfProducts");

                    b.Property<long?>("ParentDepartmentId");

                    b.HasKey("Id");

                    b.HasIndex("ParentDepartmentId");

                    b.ToTable("Departments");
                });

            modelBuilder.Entity("Data.Owner", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid?>("CreatedBy");

                    b.Property<DateTime?>("CreationDate");

                    b.Property<Guid>("Guid");

                    b.Property<bool>("IsActive");

                    b.Property<DateTime?>("ModificationDate");

                    b.Property<Guid?>("ModifiedBy");

                    b.HasKey("Id");

                    b.ToTable("Owners");
                });

            modelBuilder.Entity("Data.Product", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid?>("CreatedBy");

                    b.Property<DateTime?>("CreationDate");

                    b.Property<long>("DepartmentId");

                    b.Property<string>("Description");

                    b.Property<string>("DescriptionAr");

                    b.Property<Guid>("Guid");

                    b.Property<bool>("IsActive");

                    b.Property<int>("Likes");

                    b.Property<DateTime?>("ModificationDate");

                    b.Property<Guid?>("ModifiedBy");

                    b.Property<string>("Name");

                    b.Property<string>("NameAr");

                    b.Property<string>("PictureContent");

                    b.Property<int>("Price");

                    b.Property<float>("Rate");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("Data.ProductImages", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid>("Guid");

                    b.Property<string>("Name");

                    b.Property<long>("ProductId");

                    b.HasKey("Id");

                    b.HasIndex("ProductId");

                    b.ToTable("ProductImages");
                });

            modelBuilder.Entity("Data.Department", b =>
                {
                    b.HasOne("Data.Department", "ParentDepartment")
                        .WithMany("Departments")
                        .HasForeignKey("ParentDepartmentId");
                });

            modelBuilder.Entity("Data.Product", b =>
                {
                    b.HasOne("Data.Department", "Department")
                        .WithMany("Products")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Data.ProductImages", b =>
                {
                    b.HasOne("Data.Product", "Product")
                        .WithMany("Images")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
