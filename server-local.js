import { createApp } from "./app.js";
import { usersModel } from "./models/users.js";
import { refreshTokensModel } from "./models/refreshTokens.js";

createApp({ model: usersModel, refreshTokenModel: refreshTokensModel });
