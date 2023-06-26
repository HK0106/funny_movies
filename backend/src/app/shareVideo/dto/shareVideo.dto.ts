import { IsString, IsNotEmpty } from "class-validator";

export class ShareVideoDto {
  @IsNotEmpty()
  @IsString()
  videoUrl: string;
}
