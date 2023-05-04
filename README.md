# artbychard.com

An online gallery featuring original oil paintings and other work for sale. The site is built with React.js and powered by Stripe for secure purchases over HTTPS. Visit at https://artbychard.com.

## Features
A seamless and user-friendly experience, offering:

* Responsive navigation, with a navbar for large screens and a menu for smaller screens
* Artwork browsing with the ability to tap or click a painting to view its product page
* Options selection via drop-down menus and an "add to cart" button for easy purchasing
* A shopping cart that can be accessed by clicking or tapping the cart icon
* Checkout page with a form for entering shipping information and payment options
* A payment complete page with an optional email sign-up for order updates
* An artwork search page with filters for price and name
* An About page and Contact page with a message form for site owner communication
* Light/dark mode based on system setting, allows toggling located under the navbar for larger screens or within the menu for smaller screens. The setting is saved between visits.
* Local storage to save cart and maintain its contents between visits
* An admin dashboard for managing the database, including adding, editing, and deleting items (login credentials required)

Watch a brief video demo:

[![Watch the video](./client/src/assets/thumbnail.png)](https://drive.google.com/file/d/1kYkIfwzzWknv6RLEsQKCg5BbcpUUrys7/view)

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Technologies Used
* Docker
* AWS Elastic Beanstalk
* AWS Route 53
* AWS Certificate Manager
* AWS RDS
* AWS EC2
* Nginx
* Porkbun.com (domain)

### Client Dependencies
* @emotion/react
* @emotion/styled
* @mui/icons-material
* @mui/lab
* @mui/material
* @stripe/react-stripe-js
* @stripe/stripe-js
* @testing-library/jest-dom
* @testing-library/react
* @testing-library/user-event
* axios
* emailjs-com
* formik
* react
* react-dom
* react-query
* react-router-dom
* react-scripts
* react-stickynode
* react-swipeable
* web-vitals
* yup

### Server Dependencies
* @sendgrid/mail
* bcrypt
* connect-session-sequelize
* cors
* dotenv
* express
* express-session
* multer
* mysql2
* sequelize
* sharp
* stripe