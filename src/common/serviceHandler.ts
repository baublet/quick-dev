import { Context } from "../lambda/graphql/contextFactory";

type ServiceFactory = (context: Context) => any;

export type ServiceHandler<T extends ServiceFactory> = (service: T) => ReturnType<T>;

export function serviceHandler(context: Context): ServiceHandler<any> {
  const serviceMap = new Map<ServiceFactory, any>();

  return (service: ServiceFactory) => {
    if (!serviceMap.has(service)) {
      serviceMap.set(service, service(context));
    }
    return serviceMap.get(service);
  };
}
