import {
  images,
  ImageName,
  ImageSlug,
} from "../../../common/strapYardFile/images";

export function environmentImage(parent: { image: ImageSlug }): ImageName {
  return images[parent.image];
}
