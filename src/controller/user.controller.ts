import {Request, Response} from "express";
import {getManager} from "typeorm";
import {User} from "../entity/user.entity";
import bcyptjs from "bcryptjs";

export const Users = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User);
    const users = await repository.find();
    res.send(users.map(u => {
        const {password,...users} = u;
        return users;
    }));
}

export const CreateUser = async (req: Request, res: Response) => {
    const {role_id,...body} = req.body;
    const hashedPassword = await bcyptjs.hash('1204',10);
    const repository = getManager().getRepository(User);

    const {password,...user} = await repository.save({
        ...body,
        password: hashedPassword
    });
    console.log(body);
    res.send(user);
}
export const GetUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User);

    const {password,...user} = await repository.findOne({where: {id: parseInt(<string>req.query.id)}}); // we used params instead of body because this is a get request
    res.send(user);
}

export const UpdateUser = async (req: Request, res: Response) => {
    const {role_id,...user} = req.body;
    const repository = getManager().getRepository(User);
    await repository.update(user.id,req.body);
    const {password,...data} = await repository.findOne({ where:
            { id: user.id }});
    res.send(data);
}
export const DeleteUser = async (req: Request, res: Response) => {
    const {role_id,...user} = req.body;
    const repository = getManager().getRepository(User);
    await repository.delete(user.id);
    res.status(204).send(null);
}
