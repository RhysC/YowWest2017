# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
# Function to check whether VM was already provisioned
def provisioned?(vm_name='default', provider='virtualbox')
  File.exist?(".vagrant/machines/#{vm_name}/#{provider}/action_provision")
end

Vagrant.configure(2) do |config|
  # Prevent clashes with multiple VM's running concurrently
  config.vm.network :forwarded_port, guest: 22, host: 2222, id:"ssh", auto_correct: true
  config.vm.network :forwarded_port, guest: 8080, host: 8181, id:"web", auto_correct: true

  config.vm.network "private_network", type: "dhcp"

  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  config.vm.box = "ubuntu/trusty64"
  # Set the config.vm.box to "ubuntu/trusty64"
  $swap = <<SCRIPT
if [ ! -f "/swapfile" ]; then
  fallocate -l 4G /swapfile
  chmod 0600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
SCRIPT

  config.vm.provision :shell, inline: $swap

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 1
  end

  #Line wrapping doesn't seem to be enabled by default
  $enable_line_wrapping = <<SCRIPT
    cat >>~/.bashrc <<'EOF'
    # Enable line wrapping
    tput smam
EOF

SCRIPT

  config.vm.provision :shell, inline: $enable_line_wrapping

  # This is the default box where you run all your commands from (Ansible/Serverspec Host)
  config.vm.define "default", primary: true do |default|
    default.vm.box = "ubuntu/trusty64"

    default.vm.synced_folder "./src/", "/home/vagrant/src", create:true
    # mirror the releases directory structure on Jenkins
    # Note that the var_releases directory needs to exist on your local machine and be populated with sample data
    default.vm.synced_folder "~/.aws/", "/home/vagrant/.aws", create:true
    default.vm.synced_folder  "~/.ssh/", "/home/vagrant/.ssh_host" , create:true


  end

  config.vm.provision "shell", inline: <<-SHELL
     apt-get update
     curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
     sudo apt-get install -y nodejs
     apt-get install python-dev python-pip -q -y
     pip install --upgrade pip
     su vagrant
     mkdir /home/vagrant/node_modules
     cd .
     #ln -s /home/vagrant/node_modules/ node_modules
     pip install --upgrade --user awscli
     npm install --global serverless
     npm install --global mocha
   SHELL

end
