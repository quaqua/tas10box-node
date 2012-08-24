About tas10box
============

tas10box is a content repository system with a nice graphical
frontend. tas10box creates/updates/finds documents as a
web services. It's main communication runs through JSON
and if required BSON.

Also tas10box provides a beautiful visual interface to the
document repository.

tas10box is based on expressjs. The whole http routing will
be done through it.

Installation
============

	npm install -g tas10box

Using tas10box
============

Start a new tas10box project by calling on the command line

	tas10box new myapp

And tas10box will create the required folder structure for you.

Take a look at the app.js file which has been created in your
myapp/ folder. It is very simple. It just calls

	tas10box.start()

This assumes, that you have configured your app in the file
config/tas10_settings.json.
You can change the file by passing the filename as an argument
to the .start function. The configfile should be relative to
your application.

	tas10box.start( filename )

As your tas10_settings.json tells you, your server will defaultly
run on port 8080. Take a look at it by pointing your browser to

	http://localhost:8080

If everything works fine, your browser will redirect you to the
/login action. Now you need to run an initial setup command so
tas10box lets you in.

	tas10box setup

This sets up a user 'manager' with the password 'manager'. Give it
a try. If your mongodb is up and running, you should now be set.
