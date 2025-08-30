import WeaviateClient from '../clients/weaviateClient';

const weaviate = async () => {
  await WeaviateClient.schema
    .classCreator()
    .withClass({
      class: 'Article',
      properties: [
        { name: 'title', dataType: ['text'] },
        { name: 'content', dataType: ['text'] },
      ],
    })
    .do();

  await WeaviateClient.data
    .creator()
    .withClassName('Article')
    .withProperties({
      title: 'Hello World',
      content: 'This is my first Weaviate object!',
    })
    .do();
};

export const weaviateService = {
  weaviate,
} as const;
