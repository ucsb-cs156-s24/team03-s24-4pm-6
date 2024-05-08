import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";
import { articlesFixtures } from 'fixtures/articlesFixtures';

export default {
    title: 'pages/Articles/ArticlesEditPage',
    component: ArticlesEditPage
};

const Template = () => <ArticlesEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/articles', (_req, res, ctx) => {
            return res(ctx.json(articlesFixtures.threeArticles[0]));
        }),
        rest.put('/api/articles', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}