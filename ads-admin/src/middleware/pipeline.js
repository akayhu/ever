const pipelineMiddleware = (context, middleware, index) => {
  const nextMiddleware = middleware[index];

  if (!nextMiddleware) return context.next;

  return () => {
    const nextPipeline = pipelineMiddleware(context, middleware, index + 1);
    nextMiddleware({ ...context, done: nextPipeline });
  };
};

export default pipelineMiddleware;
