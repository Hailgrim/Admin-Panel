# Admin Panel

This is an example of a project with an administrative panel for data management and API server (both using **TypeScript**), **PostgreSQL** database and its monitoring tool (**Adminer**), **Redis** cache storage and **Nginx** for proxying. The project is launched using **Docker**.

The ```./docker-compose.yml``` contains the main services and volumes for the work of the project. In the files ```./development.yml``` and ```./production.yml``` contains additional settings for different project launch modes. You can build and run a project being in the project folder and using the ```docker compose -f docker-compose.yml -f development.yml up -d``` command. Use the ```docker compose down``` command to stop the project. In the file ```.env``` you can configure some project parameters.

## ./next

The basis of the administrative panel is Next.js . In the file ```./next/libs/config.ts``` you can specify the paths supported by the application and configure the project name, which will serve as a prefix for some functionality of the panel.

In the file ```./next/libs/function.ts``` using the ```getServerSidePropsCustom``` function, you can make SSR requests to verify the presence of user authorization tokens, and using the ```isAllowed``` function, you can verify user rights in different parts of the application.

The Redux Toolkit is used as the application state manager. RTK Query is used for API requests. In the ./store folder, you can make changes to the application state management logic.

The Material UI is used as the UI kit.

## ./nest

This part of the application acts as an API server with which you can create users, roles and set access rights to various resources.

The first user registered in the application will receive the administrator role with unlimited rights. Some other entities will also be created for the operation of the application. After registration or an attempt to reset the password, an email with a confirmation code will be sent to the user's email address. If the application is running in development mode, the emails will be sent to the test mail server. A link to access the contents of such an email can be obtained from the logs of the Docker container.

All created entities will be saved in PostgreSQL. Only user sessions will be stored in Redis.

In the file ```./nest/libs/config.ts```, you can configure various parameters for server operation.

## ./nginx

Nginx is used for proxying. In the ```./nginx/templates/default.conf.template``` file, you can set rules for routing. In the ```./nginx/html``` folder, you can change the standard nginx response pages.

## Conclusion

First of all, the project was created in order to help other programmers familiar with the platform in finding standard solutions when working with this stack. I tried to use standard solutions from the documentation on the technologies used. As much as possible, this project will be updated in accordance with the development of the technologies used. I hope this will help someone in their work.