// Ultraviolet proxy things

import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

if ("serviceWorker" in navigator) {
	(async () => {
		navigator.serviceWorker.getRegistrations().then(async (registrations) => {
			for await (const registration of registrations) {
				await registration.unregister();
			}

			navigator.serviceWorker.register("/sw.js").then((registration) => {
				registration.update().then(() => {
					console.log("Service worker registered");
				});
			});

			navigator.serviceWorker.ready.then(async () => {
				console.log("Service worker ready");
			});
		});

		const connection = new BareMuxConnection("/bare-mux/worker.js");
		await connection.setTransport("/epoxy/index.mjs", [
			{
				wisp: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/wisp/`,
			},
		]);
	})();
}
