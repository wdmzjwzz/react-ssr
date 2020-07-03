import Koa from "koa";
import React from "react";
import { renderToString } from "react-dom/server";
import staticServe from "koa-static";
import { StaticRouter } from "react-router-dom";
import App from "../shared/App";
import Router from "@koa/router";
import { matchRoutes } from "react-router-config";
import routes from "../shared/Routes";
import { Provider } from "react-redux";
import { createServerStore } from "../shared/store";

const app = new Koa();
const router = new Router();

app.use(staticServe("public"));

router.get(["/", "/about"], async (ctx, next) => {
  const branch = matchRoutes(routes, ctx.req.url);

  const store = createServerStore();
  const promises = [];
  branch.forEach((item) => {
    if (item.route.loadData) {
      promises.push(item.route.loadData(store));
    }
  });

  await Promise.all(promises)
    .then((res) => {
      const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={ctx.req.url}>
            <App></App>
          </StaticRouter>
        </Provider>
      );
      ctx.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React 服务器端渲染</title>
    </head>
    <style>
        //...三方库
    </style>
    <body>
        <div id="root">${content}</div>
        <script>window.REDUX_STORE = ${JSON.stringify(
          store.getState()
        )}</script>
        <script src="bundle.js"></script>
    </body>
    </html>
    `;
    })
    .catch((item) => {
      ctx.body = "404.html";
    });
});

router.get("/getData", (ctx) => {
  ctx.body = {
    code: 0,
    message: "",
    data: "后端返回的数据",
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(6024, () => {
  console.log(`server is running at http://localhost:6024`);
});
