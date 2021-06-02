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
Quickly add new pages or content to your vault. Powerful and customizable Templater 'plugin'.

In the default markdown file (`QuickAdd.md`), there is an array assigned to `choices`. Every element (choice) in this array must have an option name and a path to the template to insert. Choices should be separated by commas. The choices found in the default markdown file (`QuickAdd.md`) are my own settings. You might draw inspiration from them.

Choices are written in JavaScript object format, which consists of key-value pairs. They should be separated by commas. Like this: `{key1: value1, key2: value2}`.
There are two main contexts to be aware of. Adding from a template, and quick capture. I'll illustrate them by example.

#### Add from Template
| Property          | Required | Type                       | Description                                                                                                                                                     |
| ----------------- | -------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Option            | Yes      | String                     | The string shown in the suggester                                                                                                                               |
| Path              | Yes      | String                     | Path to the template you want to add a new file with.                                                                                                           |
| startSymbol       | No       | String                     | A symbol which will be added, with a space, before the file name.                                                                                               |
| folder            | No       | String or string array     | The folder to which the file will be added. If an array of strings is added, you will be prompted to select one.                                                |
| format            | No       | String                     | The format of the filename. See `format` table for more info. Note: if no `{{NAME}}` or `{{VALUE}}` is in the format, you will not be prompted to add one.      |
| appendLink        | No       | Boolean                    | If `true`, a link to the file you've added is written to your cursor position.                                                                                  |
| incrementFileName | No       | Boolean                    | If `true`, and if a file with the given name is found, it will add 1 to the file name. Like, `untitled`, `untitled1`, `untitled2`, and so on.                   |
| noOpen            | No       | Boolean                    | If `true`, the created file is not opened                                                                                                                       |
| newTab            | No       | "vertical" or "horizontal" | Can only be used if `noOpen` is `false`. Must be a string that is either equal to `horizontal` or `vertical` - this signifies how the active tab will be split. | 

#### Quick Capture
| Property    | Required | Type    | Description                                                                                                                                                                                                                                                                                   |
| ----------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Option      | Yes      | String  | The string shown in the suggester. You can use the same syntax as `format` to create other filenames, which act as quickcapture files. For example, you could write `captureTo: "daily/{{DATE}}.md"`, and it will capture to a file with the current date as it's name in the `daily` folder. |
| captureTo   | Yes      | String  | The file values are written to.                                                                                                                                                                                                                                                               |
| format      | No       | String  | The format of the filename. See `format` table for more info. Note: if no `{{NAME}}` or `{{VALUE}}` is in the format, you will not be prompted to add one.                                                                                                                                    |
| prepend     | No       | Boolean | If `true`, value will be added to the bottom of the file. Default is false.                                                                                                                                                                                                                   |
| appendLink  | No       | Boolean | If `true`, a link to the file you've captured to is written to your cursor position.                                                                                                                                                                                                          |
| task        | No       | Boolean | If `true`, the value will be preceded by a `- [ ]`.                                                                                                                                                                                                                                           |
| insertAfter | No       | String  | The value entered will be added on the line below a line matching the given string.                                                                                                                                                                                                                                                                                              |


#### `format` syntax
| Template                  | Description                                                                                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{DATE}}`                | Outputs the current date in `YYYY-MM-DD` format.                                                                                                                                                                              |
| `{{DATE:<DATEFORMAT>}}`   | Replace `<DATEFORMAT>` with a [Moment.js date format](https://momentjs.com/docs/#/displaying/format/).                                                                                                                        |
| `{{VALUE}}` or `{{NAME}}` | Interchangeable. Represents the value given in an input prompt.                                                                                                                                                               |
| `{{VALUE:<variable name>` | You can now use variable names in values. They'll get saved and inserted just like values, but the difference is that you can have as many of them as you want. Use comma separation to get a suggester rather than a prompt. | 
| `{{LINKCURRENT}}`         | A link to the file from which the template is activated from. `[[link]]` format.                                                                                                                                              |

|
#### `format` syntax
| Template                                   | Description                                                                                                                                                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{DATE}}`                                 | Outputs the current date in `YYYY-MM-DD` format.                                                                                                                                                                              |
| `{{DATE:<DATEFORMAT>}}`                    | Replace `<DATEFORMAT>` with a [Moment.js date format](https://momentjs.com/docs/#/displaying/format/).                                                                                                                        |
| `{{VDATE:<variable name>, <date format>}}` | You'll get prompted to enter a date, and it'll be parsed to the given date format. You could write 'today' or 'in two weeks' and it'll give you the date for that. Works like variables, so you can use the date in multiple places. **REQUIRES THE NATURAL LANGUAGE DATES PLUGIN!**                                                  |
| `{{VALUE}}` or `{{NAME}}`                  | Interchangeable. Represents the value given in an input prompt.                                                                                                                                                               |
| `{{VALUE:<variable name>`                  | You can now use variable names in values. They'll get saved and inserted just like values, but the difference is that you can have as many of them as you want. Use comma separation to get a suggester rather than a prompt. |
| `{{LINKCURRENT}}`                          | A link to the file from which the template is activated from. `[[link]]` format.                                                                                                                                              |



#### Multi-Choice
```js
const choices = [
	{option: "🌀 Task Manager", multi: [
		{option: "✔ Add a Task", startSymbol: "", path: "bins/templates/New Task.md", folder: "tasks"},
		{option: "✔ Quick Capture Task", captureTo: "inbox/tasks.md", task: true, format: "{{VALUE}} 📆 {{DATE}}\n"},
		{option: "✔ MetaEdit Backlog Task", captureTo: "MetaEdit Board.md", task: true, insertAfter: "## Backlog", format: "{{VALUE}}\n"},
	]},
	// ...
]

// ...
```

You can categorize choices under a single, multi-choice. These can also be nested, meaning that you can have multi-choices within multi-choices.


#### Variables
```js
const choices = [
	{
		option: "💸 Add Purchase", 
		captureTo: "workbench.md", 
		format:`|{{VALUE:Item}} | {{VALUE:💸 Cost}} | [[{{DATE:gggg-MM-DD - ddd MMM D}}]] | {{VALUE:Entertainment, Car, Groceries, Apartment}} |`,
		prepend: true
	},
	// ...
]

// ...
```

You can have as many variables as you want. They work in the same places as `{{VALUE}}` does.

#### Add from Template 1
Below is an example object representing one choice in the array.
```js
const choices = [
	{
		option: "💭 Add a Thought", 
		path: "bins/templates/Inputs/Thought.md",
		startSymbol: "~", // optional
		folder: "thoughts" // optional
	},
	// ...
]

// ...
```

This choice would be displayed as `💭 Add a Thought` in the choice suggester. If selected, it would add a new file using the template found in `bins/templates/Inputs/Thought.md`. It prompts for a value, which is the name of the file.

There are two optional keys: `startSymbol` and `folder`. 

The start symbol is prepended to the name you enter when running the script. For example, if you write "Meditations", and your start symbol is `{`, the file name will be `{ Meditations`.

The folder key represents which folder your item will be created in. If it does not exist, it will be made. `folder` can be either a single string, like: `folder: "folderName"`, or an array of strings: `folder: ["projects/one", "projects/two", "projects/three"]`.

#### Add from Template 2
```js
const choices = [
	 {
	 	option: "📥 Add an Inbox item",
		path: "bins/templates/Inbox Template.md"},
		format: `{{DATE:gggg-MM-DD-HH-MM-SS}} - {{NAME}}`,
		folder: "inbox",
	},
	// ...
]

// ...
```

This example is much like the one above. The main difference is the `format` property. This formats the file name with the format defined in the string.

Format has three 'template' values. `{{DATE}}`, `{{LINKCURRENT}}` and `{{NAME}}`. Name has an alias, `{VALUE}}`, which you can use interchangeably. I'll explain `{{LINKCURRENT}}` in the Quick Capture 1 example.

If you write `{{DATE}}`, it'll give today's date in the `yyyy-mm-dd` format. You can pass in another date format - like the one shown in the example - but you will have to add a colon between `DATE` and the specified format. Example: `{{DATE:gggg-MM-DD-HH-MM-SS}}`.
The one in the example would set the value to `2021-05-27-04-08-14`. The date format is the [Momentjs format](https://momentjs.com/docs/#/displaying/format/), and relies on Templater to parse it.

Besides this, the format is a simple string, so you can pass in any string value you want. Because Templater allows for Javascript execution, you can make some creative formats using [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

#### Quick Capture 1
```js
const choices = [
	 {
	 	option: "✍ Quick Capture", 
		captureTo: "inbox/appendToInbox.md", 
		format: "# [[{{DATE:gggg-MM-DD - ddd MMM D}}]] {{DATE:hh:mm}}\n{{LINKCURRENT}}: {{VALUE}}\n\n",
		prepend: false,
		appendLink: false
	}
	// ...
]

// ...
```

Now, quick captures are defined by the `captureTo` property. It should be given the path to a file which you would like to write to. By default, what you're trying to do a quick capture of will be written to the top of the document. You can use `prepend: true` to make it go to the bottom of the document. Another notable property is `appendLink`. If you set this property to true, the template will drop a link to the file you captured to.

Selecting this choice, a value corrresponding to the format will be added to the `inbox/appendToInbox.md` file. Running this, I added the following to my file:
```
# [[2021-05-27 - Thu May 27]] 03:57
[[bins/templates/QuickAdd.md]]: this is an example


```

#### Quick Capture 2
```js
const choices = [
	 {
	 	option: "✔ Quick Capture Task", 
		captureTo: "inbox/tasks.md", 
		task: true, 
		format: "{{VALUE}} 📆 {{DATE}}"
	}
	// ...
]

// ...
```
This choice is a little simpler, and primarily demonstrates the `task` property. If `task` is set to `true`, then `- [ ]` will be prepended to the value - no matter the format.

Using this choice, I added `- [ ] a new task 📆 2021-05-27` to my `inbox/tasks.md` file. This is what's used to denote a task date in the [Obsidian Tasks](https://github.com/schemar/obsidian-tasks) plugin.😉

#### Quick Capture 3
```js
const choices = [
	 {
		option: "🚶‍♂️ Add journal item", 
	 	captureTo: "bins/daily/{{DATE:gggg-MM-DD - ddd MMM D}}", // My daily journal file name format and folder
		insertAfter: "## What did I do today?", // Looks for this line and inserts the text below it
		format: "- {{DATE:HH:mm}} {{VALUE}}\n"}, // Format of the entry
	// ...
]

// ...
```

This quick capture choice lets me quickly add journal entry points to my daily journal.
It'll be in this format: `- 18:05 Cooked dinner`.

![BR2Rdt4jDn](https://user-images.githubusercontent.com/29108628/119866008-9b465780-bf1c-11eb-8560-009d229ea7b6.gif)


#### Main menu
![image](https://user-images.githubusercontent.com/29108628/119146591-0f7b8980-ba4b-11eb-8fac-ab275067434f.png)
#### Add
![image](https://user-images.githubusercontent.com/29108628/119146655-21f5c300-ba4b-11eb-9aa4-dd105cd430f8.png)
#### Start symbol (~)
![image](https://user-images.githubusercontent.com/29108628/119146711-31750c00-ba4b-11eb-9531-d737c9b71cd6.png)
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
