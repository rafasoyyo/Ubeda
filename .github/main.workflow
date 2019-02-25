workflow "Run Deploy" {
  on = "push"
  resolves = [ "Deploy Google Cloud" ]
}

action "Login Google Cloud" {
  uses = "actions/gcloud/auth@master"
  secrets = ["GCLOUD_AUTH"]
}

action "Pull Google Cloud" {
  uses = "actions/gcloud/cli@master"
  needs = ["Login Google Cloud"]
  args = ["pull", "origin", "master", "--force"]
  env = {
    PROJECT_ID = "boda-1539644184161"
  }
  runs = "git"
}

action "Deploy Google Cloud" {
  uses = "actions/gcloud/cli@master"
  needs = ["Pull Google Cloud"]
  args = ["app", "deploy", "--project", "boda-1539644184161"]
  env = {
    PROJECT_ID = "boda-1539644184161"
  }
  runs = "gcloud"
}