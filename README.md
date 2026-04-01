# template
The repository to hold template that includes webpack configurations

Once a new repository is created based on this template, run the following commands locally:
1. ```npm install -y --init-mode=module```
2. ```npm install --save-dev webpack-dev-server```

This will set up all the needed packages that were initially installed for this template (to handle HTML, CSS, custom fonts, images, CNAME, etc.)
And it will also install webpack dev server to be able to check the changes localy live - access at http://localhost:8080/

To start the web server, run ```npm run start```

To deploy the project after and push it to GitHub Pages, follow the steps below:

1. Run ```git branch gh-pages``` - this is run only once per project, the rest of the steps should be done every time you deploy or redeploy your project.
2. Check that all prev work is commited - run ```git status```
3. Run ```git checkout gh-pages && git merge main --no-edit``` to change branch and sync changes from main
4. To bundle application and be ready for commit, run ```npm run build``` - it will create the dist folder
5. Run ```git add dist -f && git commit -m "Deployment commit"``` 
6. Run ```git subtree push --prefix dist origin gh-pages``` 
7. Run ```git checkout main```
