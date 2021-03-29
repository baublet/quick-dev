import { Context } from "./createContext";

type ServiceFactory = (context: Context) => any;

export type ServiceHandler<T extends ServiceFactory = any> = (
  service: T
) => ReturnType<T>;

export function serviceHandler(context: Context) {
  const serviceMap = new Map<ServiceFactory, any>();

  return <T extends ServiceFactory>(service: T): ReturnType<T> => {
    if (!serviceMap.has(service)) {
      serviceMap.set(service, service(context));
    }
    return serviceMap.get(service);
  };
}
