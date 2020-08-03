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
import cheerio from "cheerio"
import fs from "fs"
import path from "path"

const template = fs.readFileSync("./public/index.html", 'utf-8')
const app = new Koa();
const router = new Router();
const $ = cheerio.load(template)
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
      $("#root").html(content)
      $("body").append(`<script>window.REDUX_STORE = ${JSON.stringify(store.getState())}</script>`)
      ctx.body = $.html()
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
