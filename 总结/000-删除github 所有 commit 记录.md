- 新建一个空白分支

  ```
  git checkout --orphan latest_branch
  ```

- 添加所有文件

  ```
  git add -A
  ```

- 提交

  ```
  git commit -am "."
  ```

- 强制删除旧的分支，如果是 `master`

  ```
  git branch -D master
  ```

- 将当前分支重命名为 `master`

  ```
  git branch -m master
  ```

- 强制推送到远程仓库

  ```
  git push -f origin master
  ```

  

