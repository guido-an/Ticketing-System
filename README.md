# Ticketing System
http://support.vanillamarketing.it/

An internal ticketing system application for managing new customers' requests. <br><br>
Built with Node, Express, Mongo and Handlebars.


<h1>Instructions</h1>


.env file

PORT=[port]<br>
SESSIONSECRET=[secret]<br>
admin=[admin_username]<br>
MONGODB_URI=[mongoDB connection]<br>
CLOUDINARY_NAME=[coudinary_name]<br>
CLOUDINARY_KEY=[coudinary_key]<br>
CLOUDINARY_SECRET=[coudinary_secret]<br>
ADMIN_EMAIL=[admin_email]<br>
NODEMAILER_EMAIL=[nodemailer_email]<br>
NODEMAILER_PSW=[nodemailer_psw]

<h1>Functionalities</h1>

<ul>

<li>The user can create a new ticket, upload images, see all his tickets, answer to the admin and filter the tickets according to the status that can be active or closed. The user receives a notification email when there is a new answer or the ticket is closed. The user can also check all the agency's customers and their relative tickets.</li>
<br>
<li>The admin of the system can view all the tickets created by users, answer to them, change their status and filter them. The admin receives a notification email when a new ticket is created.</li>
</ul>
<h1>Preview</h1>
http://support.vanillamarketing.it/
<img src="https://user-images.githubusercontent.com/30729360/65434688-851af680-de1f-11e9-8398-61bf5d415e7e.png">
