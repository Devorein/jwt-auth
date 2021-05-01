import { Request, Response } from 'express';

export interface Payload {
	id: string;
	tokenVersion: number;
}

export type Context = {
	req: Request;
	res: Response;
	payload: Payload;
};
