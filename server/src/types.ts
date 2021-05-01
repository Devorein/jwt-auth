import { Request, Response } from 'express';

export interface Payload {
	id: string;
}

export type Context = {
	req: Request;
	res: Response;
	payload: Payload;
};
