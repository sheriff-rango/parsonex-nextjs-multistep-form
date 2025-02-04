import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H2, H3, H4 } from "@/components/typography";
import { emails, phones, addresses } from "@/server/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Email = InferSelectModel<typeof emails>;
type Phone = InferSelectModel<typeof phones>;
type Address = InferSelectModel<typeof addresses>;

interface ContactCardProps {
  emails: Email[];
  phones: Phone[];
  addresses: Address[];
  className?: string;
}

export function ContactCard({
  emails,
  phones,
  addresses,
  className = "",
}: ContactCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <H2>Contact</H2>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <H3>Email</H3>
            {emails.map((email: Email) => (
              <div key={email.emailId} className="mb-2 ml-2">
                <div className="font-medium capitalize">{email.emailType}</div>
                <div>{email.emailAddress}</div>
              </div>
            ))}
            {emails.length === 0 && (
              <div className="ml-2 text-gray-500">No associated emails</div>
            )}
          </div>

          <div>
            <H3>Phone</H3>
            {phones.map((phone: Phone) => (
              <div key={phone.phoneId} className="mb-2 ml-2">
                <div className="font-medium capitalize">{phone.phoneType}</div>
                <div>{phone.phoneNumber}</div>
              </div>
            ))}
            {phones.length === 0 && (
              <div className="ml-2 text-gray-500">
                No associated phone numbers
              </div>
            )}
          </div>

          <div>
            <H3>Address</H3>
            {addresses.map((address: Address) => (
              <div key={address.addressId} className="mb-2 ml-2">
                <H4 className="capitalize">{address.addressType}</H4>
                <div>
                  {address.address1} {address.address2 || ""}
                </div>
                <div>
                  {address.city}, {address.state} {address.zip}
                </div>
              </div>
            ))}
            {addresses.length === 0 && (
              <div className="ml-2 text-gray-500">No associated addresses</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
