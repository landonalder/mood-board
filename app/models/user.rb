class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :ldap_authenticatable, :rememberable, :trackable
  extend FriendlyId
  friendly_id :full_name, use: [:slugged]

  has_many :moods, inverse_of: :user, dependent: :delete_all

  validates :email, format: { with: /\A[a-zA-Z\d._-]+@nordstrom.com\z/,
    message: 'Email must be a valid nordstrom email address.'}

  after_create :create_first_mood
  scope :users_with_moods, -> { includes(:moods).where.not(moods: { id: nil }) }

  def image_url
    Gravatar.new(email).image_url
  end

  def current_mood
    moods.order('created_at').last
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def create_first_mood
    self.moods.create(top: 360, left: 492)
  end

  def ldap_before_save
    self.email = Devise::LDAP::Adapter.get_ldap_param(self.login, "mail").first
    self.first_name = Devise::LDAP::Adapter.get_ldap_param(self.login, "givenName").first
    self.last_name = Devise::LDAP::Adapter.get_ldap_param(self.login, "sn").first
  end
end
