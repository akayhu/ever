  // 專案成就
  const honor = {
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        maxLength: 100,
        minLength: 1,
      },
      description: {
        oneOf: [
          {
            type: 'string',
            // maxLength: 1000,
          },
          {
            type: 'null',
          },
        ],
      }
    },
  }
  
  
  export default {
    honor,
  }
  