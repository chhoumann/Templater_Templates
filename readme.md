# Christian's Templater Templates
Found a template your like? Make sure you copy the raw file - not what Github renders. Click this button to see the raw file:
![image](https://user-images.githubusercontent.com/29108628/119149655-017b3800-ba4e-11eb-978f-7be6435bbf29.png)

## Scripts
You will have to define a folder for your userscripts in Templater. Do this in your Templater settings under "Script files folder location". Remember, the scripts are called like this: `tp.user.QuickAdd(tp, choices);`, where `QuickAdd` is the _case-sensitive_ name of thie file. So, if you change the file name, change it in the markdown template as well.

#### Installation of Scripts
1. Grab both the `.md` and `.js` file. Make sure it is the _raw_ markdown file.
2. Make sure you've set a file path to "Script files folder location" as well as a "Template folder location" in your Templater settings.
3. Add the `.md` file ot the folder you've set as your "Template folder location".
4. Add the `.js` file ot the folder you've set as your "Script files folder location".

**IMPORTANT:** If you are inserting a template that has more than text (templater commands, etc), then you need to enable `Trigger Templater on file creation`.

https://user-images.githubusercontent.com/29108628/119812018-fa3da980-bee7-11eb-856a-02cd034055fc.mp4

### [QuickAdd v2](https://github.com/chhoumann/Templater_Templates/tree/master/quickadd)
Please use the [QuickAdd plugin](https://github.com/chhoumann/quickadd) instead.

### https://github.com/chhoumann/Templater_Templates/tree/master/readwise
Insert anything from your Readwise account. You will need your Readwise token - which you can get [here](https://readwise.io/access_token).
It should be able to fetch anything from any time.

To get the main menu, use the `readwise.md` template. If you want to have a quote fetched from your "supplementals", you can use `readwisedaily.md`. I use that one in my daily note to show me a quote from one of the books I've marked as "supplemental".

#### Main menu
![Obsidian_UfeK41i3zb](https://user-images.githubusercontent.com/29108628/119157789-d3015b00-ba55-11eb-847d-58de6f721948.png)
#### Books
![image](https://user-images.githubusercontent.com/29108628/119146073-8e23f700-ba4a-11eb-984d-044d0e7b6528.png)
#### Book selected
![image](https://user-images.githubusercontent.com/29108628/119146100-954b0500-ba4a-11eb-82a2-46ce9e6d256d.png)
#### Write one highlight (select highlight)
![image](https://user-images.githubusercontent.com/29108628/119146122-9bd97c80-ba4a-11eb-984c-a8c0dc821a65.png)

### [Books (dataview)](https://github.com/chhoumann/Templater_Templates/tree/master/books)
This is a dataview query.
![image](https://user-images.githubusercontent.com/29108628/119533818-8a63dd80-bd86-11eb-8ee5-1cfa996b37c1.png)


## Templates
Simple markdown templates that augment workflow.

#### Installation
1. Make sure you've set a path to "Template folder location" in your Templater settings.
2. Add the `.md` file ot the folder you've set as your "Template folder location". Make sure this is the _raw_ markdown file. See instructions at the top of the page.

https://user-images.githubusercontent.com/29108628/119813486-a0d67a00-bee9-11eb-9e5b-7bed3f9eccee.mp4

### https://github.com/chhoumann/Templater_Templates/blob/master/code.md
Insert a codebox with the language specifed. Has two predefined languages.
![image](https://user-images.githubusercontent.com/29108628/119144684-333dd000-ba49-11eb-9ac6-0cbdc097c35c.png)

**Example:**
````
```CSharp

```
````

### https://github.com/chhoumann/Templater_Templates/blob/master/latex_colors.md
Insert a LaTeX color with any predefined color.
![image](https://user-images.githubusercontent.com/29108628/119145178-b0694500-ba49-11eb-8d85-74209fe67c48.png)

**Example:**
`\color{black}`

### https://github.com/chhoumann/Templater_Templates/blob/master/latex_environment.md
Insert a LaTeX environment (without $$$$ - I assume this is already done).
![image](https://user-images.githubusercontent.com/29108628/119145473-f58d7700-ba49-11eb-842e-c36ce35c3ee2.png)

Example:
```
$$
	\begin{gather} 
        // cursor will be set here
  \end{gather}
$$
```

### https://github.com/chhoumann/Templater_Templates/blob/master/dataview/copy_links_in_query.md
This allows you to copy links to files found in a Dataviewjs query. You can customize the format however you want.

DEMO (and my use case):
![p19qk7DGAX](https://user-images.githubusercontent.com/29108628/120461646-7594d480-c39a-11eb-829b-71865e627300.gif)
