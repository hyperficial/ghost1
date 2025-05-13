import Fastify, {
	type FastifyReply,
	type FastifyRequest,
	type FastifyServerFactory,
	type FastifyServerFactoryHandler,
	type RawServerDefault,
} from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import wisp from "wisp-server-node";

import { createServer } from "node:http";
import type { Socket } from "node:net";

const serverFactory: FastifyServerFactory = (
	handler: FastifyServerFactoryHandler,
): RawServerDefault => {
	return createServer()
		.on("request", (req, res) => {
			handler(req, res);
		})
		.on("upgrade", (req, socket, head) => {
			if (req.url?.endsWith("/wisp/")) {
				wisp.routeRequest(req, socket as Socket, head);
			}
		});
};

const app = Fastify({
	logger: false,
	ignoreDuplicateSlashes: true,
	ignoreTrailingSlash: true,
	serverFactory: serverFactory,
});

await app.register(fastifyStatic, {
	root: fileURLToPath(new URL("./public", import.meta.url)),
});

await app.register(fastifyMiddie);

const port =
	Number.parseInt(process.env.PORT as string) || Number.parseInt("8080");

app.listen({ port: port, host: "0.0.0.0" }).then(async () => {
	console.log(`Server listening on http://localhost:${port}/`);
});
