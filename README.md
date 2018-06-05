# Crypto news from Twitter stream

Repository for Team 1 on [Cryptodatathon](https://www.cryptodatathon.com/).


## Environment

## AWS EC

### Jupyter Notebook on AWS EC2

First, install and setup Anaconda.

* Install Anaconda:
  ```
  mkdir env
  cd env
  curl -O https://repo.anaconda.com/archive/Anaconda3-5.2.0-Linux-x86_64.sh
  bash Anaconda3-5.2.0-Linux-x86_64.sh
  ```
* Create conda environemnt with name `ds3` and update jupyter :
  ```
  conda create -n ds3 anaconda
  source activate ds3
  pip install msgpack
  pip install -U jupyter
  ```
* Install other needed Python packages with `pip` or `conda`.

Second, setup Jupyter Server.

* Create certificates:
  ```
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cdt2_jupyter_cert.key -out cdt2_jupyter_cert.pem
  ```
* Configure Jupyter server:
   ```
  jupyter notebook --generate-config
  jupyter notebook password
  nano /home/ubuntu/.jupyter/jupyter_notebook_config.json
  ```
* The contents of the `jupyter_notebook_config.json` is:
  ```
  {
  "NotebookApp": {
    "certfile": "/path_to/cdt2_jupyter_cert.pem",
    "password": "sha1:[hash of your password]"
    "keyfile": "/path_to/cdt2_jupyter_cert.key",
    "ip": "[hostname identifier of your machine].compute-1.amazonaws.com",
    "port": 9999,
    "open_browser": false
    }
  }
  ```
* Run Jupyter server, preferably in a separate screen:
  ```
  screen -S jupyter
  source activate ds3
  nohup jupyter notebook
  ```
* You can detach the screen with `Ctrl-A-D` shortcut, and reattach on the screen with:
   ```
   screen -r jupyter
   ```

Connect to Jupyter notebook.

* Create SSH tunnel
   ```
   ssh -i /path_to/CDteam2.pem -N -f -L localhost:9999:localhost:9999 ubuntu@[hostname identifier of your machine].compute-1.amazonaws.com
   ```
* Open `https://localhost:9999/` in browser. The password is the one you defined with the `jupyter notebook password` command.
 
 
 
 
