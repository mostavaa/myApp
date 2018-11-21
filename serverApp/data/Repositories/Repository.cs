using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private ClothesContext Context { get; set; }
        public Repository(ClothesContext context)
        {
            Context = context;
        }
     
        public void Add(T entity)
        {
            Context.Set<T>().Add(entity);
        }

        public void Delete(long entity)
        {
            T existing = Context.Set<T>().Find(entity);
            if (existing != null) Context.Set<T>().Remove(existing);
        }

        public IQueryable<T> Get()
        {
            return Context.Set<T>();
        }

        public IQueryable<T> Get(System.Linq.Expressions.Expression<Func<T, bool>> predicate)
        {
            return Context.Set<T>().Where(predicate);
        }

        public void Update(T entity)
        {
            Context.Entry(entity).State = EntityState.Modified;
            Context.Set<T>().Attach(entity);
        }
    }
}
