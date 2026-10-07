---
title: How to Handle LinkedIn and Twitter Link Previews.
date: 2022-04-10
tags: seo, html
cover: /articles/how-to-handle-linkedin-and-twitter-link-previews/cover.jpg
---
## **INTRODUCTION**
It's been a while I've posted an article on Dev Community, well, a while is somewhat over a year. Anyways, while I was gone,I've learnt quite a lot which I'll get into some other time.
 
So, I was working on my portfolio site, and I decided to share the link on LinkedIn and Twitter and noticed something was wrong;

The image previews and description wasn't showing up quite right, I made a couple of research and still saw I wasn't getting the image to show up. I debugged and discovered I wasn't sharing the image quite right.

In this article, I'd take you through a step-by-step process of getting your link preview done properly(especially that image part, lol).


## HANDLING THE PREVIEWS
Before I start, I know some people will say this is a job for marketers and not developers but it wouldn't hurt to know bit of it. 

When you make a post on LinkedIn or Twitter, they take data from the meta tags on that page and preview it  for the viewers to get a glimpse of what they'll be viewing by clicking on that link. Here's an example for Linked and Twitter respectively;


![LinkedIn Post Preview](/articles/how-to-handle-linkedin-and-twitter-link-previews/01.png)

![Twitter Post Preview](/articles/how-to-handle-linkedin-and-twitter-link-previews/02.png)



## HOW CAN YOU DO THIS ON LINKEDIN
To do this on LinkedIn, you need to include the following meta tags and make sure they are properly formatted.

![LinkedIn Meta Tags](/articles/how-to-handle-linkedin-and-twitter-link-previews/03.png)


Note that LinkedIn has a couple of rules concerning the image link placed here. I'll list them below;

- The maximum file size allowed is 5MB.

- The minimum image dimension should be 1200px X 627px.

I encountered a problem while trying to share my image from photo hosting sites like Imgur and Google Photos so here's how I got around that issue. 

I uploaded the photo to Google Photos but instead of creating a link to share the image, I opened up the image, right-clicked on it to pop open the menu and copied the image address. I pasted the address in the meta tag and it worked for me. I think LinkedIn can't pull data off the shareable link because, well, it is protected. Let me know in the comment section if that doesn't work for you.

## HOW CAN YOU DO THIS ON TWITTER
While LinkedIn relies on the Open Graph meta tags to preview links, Twitter does it's own a bit differently, it uses Twitter card meta tags.


![Twitter Meta Tags](/articles/how-to-handle-linkedin-and-twitter-link-previews/04.png)

Again, I placed my url the same way I handled it for LinkedIn.

## CONCLUSION
So, in case you want to see how you page/site looks before actually posting them on Twitter or LinkedIn, you can use the  [LinkedIn Post Inspector Tool](https://www.linkedin.com/post-inspector/) for LinkedIn Posts or [Twitter Card Validator](https://cards-dev.twitter.com/validator) for Twitter Posts.


**THANKS FOR READING!!**
