---
title: Lazy Loading with Intersection Observer API
date: 2022-05-01
tags: javascript, html, css, webdev
cover: /articles/lazy-loading-with-intersection-observer-api/cover.png
---
## **INTRODUCTION**
So recently, I came across a better way to implement image lazy-loading on a web-page, so after a couple of articles and videos, I implemented it this way.

Before we start, let's define two things.

1. Lazy Loading: `Lazy-loading` is a technique used in optimizing a content on a web-page and in these article, we'll be using it in relation to image loading on a web-page.

2. Intersection Observer API: The `Intersection Observer` API is a browser API that provides a way for the browser to measure the position of a DOM element relative to the top of the view-port. One key thing to note is that it performs all these operations asynchronously.

Now, that we've defined that, let's see how we can use that to "lazy-load" images.

## Step 1: HTML

![Markup](/articles/lazy-loading-with-intersection-observer-api/01.png)

Notice the images to be lazy loaded assigned a class of `lazy-img` and a `data-src` attribute. The links in src attributes of these images are placeholders that will load on the page initially before they are replaced by the images in the `data-src` attribute as we scroll.

## Step 2: CSS (Optional)

![Styling](/articles/lazy-loading-with-intersection-observer-api/02.png)

I decided to make the images block elements here so that they don't all show up when the DOM is loaded, that way, some images are hidden from the view-port enabling us to see the effect of lazy-loading.

## Step 3: JavaScript
![Functionality](/articles/lazy-loading-with-intersection-observer-api/03.png)

The Intersection Observer API takes in a callback function and options guiding how the callback should be called. 

The `root` option specifies the element to be used as the view-port for checking the visibility of the target DOM element. It defaults to the browser's viewport if set to null.

The `threshold` option takes in a number specifying how much of the target element should be visible before the callback is executed. In this case, I set it to 0.5 which indicates 50%.

## Final Step - Test
So you can see it in effect, below is an embedded code-pen showing lazy-loading implemented.

<iframe class="embed" title="CodePen demo" loading="lazy" src="https://codepen.io/samuelorobosa/embed/BaYaroG?default-tab=result&theme-id=dark"></iframe>

[Open the demo on CodePen](https://codepen.io/samuelorobosa/pen/BaYaroG)
