import { type Gender } from './user.response.dto.js';

export default class UserRequestDto {
  name: string;
  yearOfBirth: number;
  gender: Gender;
}
