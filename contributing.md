## Setting up the project for contribution (Git Part)

**1. Fork the repository**

- On the GitHub page of the project you want to contribute to, click the "Fork" button.
- This creates a copy of the repository under your GitHub account.

**2. Clone your fork:**

- Clone your forked repository to your local machine.
- Use: git clone https://github.com/your-username/repository-name.git . (including the dot at the end to clone the repository into the current directory)

**3. Set up remotes:**

- Add the original repository as a remote called "upstream".
- Use: git remote add upstream https://github.com/AlexiusTatius/NITJ_Intranet_Culture.git

## Important Branches

- So there will be 2 important branches in the repository:
  - **master:** This branch will be the default branch. It will have the latest stable code.
  - **dev:** This branch will have the latest code. It will have the latest features and bug fixes. This branch may not be stable all the time.
- We'll be creating feature branches from the dev branch and then creating a pull request to merge the code into the dev branch.
- The **master branch** will be updated from the **dev branch** after testing the code in the dev branch.
- The **dev branch** will be using `git rebase` for all the commits with the feature branches. This branch will have the complete git history of all the commits from all the contributors.
- The **master branch** will be using `git merge -- squash` for all the commits with the dev branch. It will hold the stable code of multiple commits in a single commit.

## Keep your forked repository updated:

DO NOT USE THE `Sync Fork` button on GitHub. It will create a merge commit, instead of a rebase commit. We need to keep the git history clean.

**Update the forked repository using the below commands:**
You need to keep your forked repository in sync with the original repository. Especially the **dev branch.**
Here are the steps to do that **:**

```bash
git fetch upstream
git checkout dev
git rebase upstream/dev
git push origin dev
```

If you want to update the master branch, you can do that using the below commands:

```bash
git checkout master
git rebase upstream/master
git push origin master
```

Similarly, you can update any feature branch using the below commands:

```bash
git checkout feature-branch
git rebase upstream/dev
git push origin feature-branch
```

## Creating an feature branch for resolving issue:

Let's say you want to work on an issue. The issue number is **#20** (issue related to bug-fix). Here are the steps to work on the issue and generate a pull request:

**1. Create a feature branch which MUST branch off from dev**

```bash
$ git checkout dev
Switched to branch 'dev'

$ git checkout -b issue-20-bug-fix
Switched to a new branch 'issue-20-bug-fix'
```

## Generating a pull request:

Before you generate a pull request, make sure you have the latest code from the dev branch.

You should follow the below steps to get the latest code from the dev branch of the original upstream repository and then push your changes to your forked repository.

**Step 1: Update your branch with git rebase**

```bash
$ git checkout issue-20-bug-fix
Switched to a new branch 'issue-20-bug-fix'

$ git fetch upstream
remote: Counting objects: 69, done.
remote: Compressing objects: 100% (23/23), done.
remote: Total 69 (delta 49), reused 39 (delta 39), pack-reused 7
Unpacking objects: 100% (69/69), done.git checkout

$ git rebase upstream/dev
```

**Step 2: Push your updated branch to your remote fork**

```bash
$ git push origin issue-20-bug-fix
```

See how to write the commit message below section [Commit messages](#commit-messages)

**Step 3: Open the pull request**

- Go to your forked repository on GitHub.
- Generate a pull request to the dev branch of the original repository.

## Commit messages:

- The commit messages should be clear and descriptive.
- They should follow the below format.

```bash
<type of commit>: <Basic heading of commit>
  Fixes #<issue_number>
- <Description of commit in points>
- <Description of commit in points>
- <Description of commit in points>
```

**Important:**

- Try to keep a single commit for a single issue.
- Only create multiple commits if large number of files are being changed, and each commit is a big logical change.

## Illustration of Git Workflow:

- The below images illustrate the git workflow for the project.

#### WorkFlow Image 1

![Git Workflow 1](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%201.png)

#### WorkFlow Image 2

![Git Workflow 2](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%202.png)

#### WorkFlow Image 3

```bash
git checkout branch-20
git rebase disciple
```

![Git Workflow 3](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%203.png)

```bash
git checkout disciple
```

#### WorkFlow Image 4

![Git Workflow 4](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%204.png)

```bash
git rebase branch-20
```

#### WorkFlow Image 5

![Git Workflow 5](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%205.png)

```bash
git rebase branch-21

```

#### WorkFlow Image 6

![Git Workflow 6](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%206.png)

```bash
git checkout master
git merge disciple
```

#### WorkFlow Image 7

![Git Workflow 7](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%207.png)

```bash
git checkout disciple
git checkout -b branch-22
git commit -m "some message1"

git checkout disciple
git commit -m "some message2"

git checkout branch-22
```

#### WorkFlow Image 8

![Git Workflow 8](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%208.png)

```bash
git rebase disciple
git checkout disciple
git rebase branch-22
git commit -m "some message3"
git commit -m "some message4"
```

#### WorkFlow Image 9

![Git Workflow 9](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%209.png)

```bash
git checkout master
```

#### WorkFlow Image 10

![Git Workflow 10](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%2010.png)

```bash
git merge disciple
```

#### WorkFlow Image 11

![Git Workflow 11](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%2011.png)

<h3>The final Git workflow will look like this:</h3>

#### WorkFlow Image 12

![Git Workflow 12](public/ProjectInfo/Git%20Workflow%20Images/GitRebase%20Workflow%2012%20Final.png)

For more understanding of git rebase, git merge and the overall git workflow you can visit the following link: [Git Workflow](https://onlywei.github.io/explain-git-with-d3/#zen)
