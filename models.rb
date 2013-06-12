require 'rubygems'
require 'dm-core'

class User
  include DataMapper::Resource
  property :id, Serial
  property :username, String, :unique => true, :required => true
  property :publickey, String, :required => true
  property :password, String, :required => true

  has n, :messages
end

class Message
  include DataMapper::Resource
  property :id, Serial
  property :body, String, :required => true
  property :recipient, Integer, :required => true

  belongs_to :user
end
