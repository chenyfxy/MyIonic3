export class UserModel {
  constructor(
    public id: number,
    public userName: string,
    public password: string,
    public  userSex: string,
    public nickName: string,
    public cellNumber: number,
    public isSelected: boolean
  ) {}
}
