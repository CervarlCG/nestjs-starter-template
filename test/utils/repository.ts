export function generateRepositoryMock( values: any = [], options: {
  findWhereKey?: string,
  deleteWhereKey?: string,
  updateWhereKey?: string
} = {} ) {
  let storage = [...values];
  const findWhereKey = options.findWhereKey || "id";
  const deleteWhereKey = options.deleteWhereKey || "id";
  const updateWhereKey = options.updateWhereKey || "id"
  return { 
    findOne: jest.fn((queryOptions) => {
      return storage
        .find(item => 
          item[findWhereKey] === queryOptions.where[findWhereKey] 
          && (queryOptions.where.deletedAt ? !item.deletedAt : true)
        ) || null
    }), 
    create: jest.fn(data => data), 
    save: jest.fn(data => ({...data, id: 1})),
    delete: jest.fn(where => {
      storage = storage.filter(item => item[deleteWhereKey] !== where[deleteWhereKey]);
    }),
    update: jest.fn((where, data) => { 
      storage = storage.map(item => {
        if( item[updateWhereKey] !== where[updateWhereKey] ) return item;
        else return {...item, ...data};
      });
    })
  }
}

function formatValue( value: any ) {
  const type = typeof value;
}