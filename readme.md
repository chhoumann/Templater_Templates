# Christian's Templater Templates
Found a template your like? Make sure you copy the raw file - not what Github renders. Click this button to see the raw file:
![image](https://user-images.githubusercontent.com/29108628/119149655-017b3800-ba4e-11eb-978f-7be6435bbf29.png)


## Templates
## https://github.com/chhoumann/Templater_Templates/blob/master/code.md
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
## Scripts
You will have to define a folder for your userscripts in Templater. Do this in your Templater settings under "Script files folder location". Remember, the scripts are called like this: `tp.user.QuickAdd(tp, choices);`, where `QuickAdd` is the _case-sensitive_ name of thie file. So, if you change the file name, change it in the markdown template as well.

### https://github.com/chhoumann/Templater_Templates/tree/master/readwise
Insert anything from your Readwise account. You will need your Readwise token - which you can get [here](https://readwise.io/access_token).
It should be able to fetch anything from any time.

#### Main menu
![Obsidian_UfeK41i3zb](https://user-images.githubusercontent.com/29108628/119157789-d3015b00-ba55-11eb-847d-58de6f721948.png)
#### Books
![image](https://user-images.githubusercontent.com/29108628/119146073-8e23f700-ba4a-11eb-984d-044d0e7b6528.png)
#### Book selected
![image](https://user-images.githubusercontent.com/29108628/119146100-954b0500-ba4a-11eb-82a2-46ce9e6d256d.png)
#### Write one highlight (select highlight)
![image](https://user-images.githubusercontent.com/29108628/119146122-9bd97c80-ba4a-11eb-984c-a8c0dc821a65.png)

### https://github.com/chhoumann/Templater_Templates/tree/master/quickadd
Add a new page given a template. Can prepend a 'start symbol', which can be used to denote litterature notes and the likes.
You can select the text, start symbol, and template to add.

### Main menu
![image](https://user-images.githubusercontent.com/29108628/119146591-0f7b8980-ba4b-11eb-8fac-ab275067434f.png)
### Add
![image](https://user-images.githubusercontent.com/29108628/119146655-21f5c300-ba4b-11eb-9aa4-dd105cd430f8.png)
### Start symbol (~)
![image](https://user-images.githubusercontent.com/29108628/119146711-31750c00-ba4b-11eb-9531-d737c9b71cd6.png)

### [Books (dataview)](https://github.com/chhoumann/Templater_Templates/tree/master/books)
This is a dataview query.
![image](https://user-images.githubusercontent.com/29108628/119533818-8a63dd80-bd86-11eb-8ee5-1cfa996b37c1.png)
