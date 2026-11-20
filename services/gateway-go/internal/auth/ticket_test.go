package auth

import (
	"testing"
)

func TestExtractTicketFromProtocol_Valid(t *testing.T) {
	header := "trailguard, ticket.a1b2c3d4e5f67890abcdef1234567890"
	ticket, err := ExtractTicketFromProtocol(header)
	if err != nil {
		t.Fatalf("expected valid extraction, got error: %v", err)
	}

	expected := "a1b2c3d4e5f67890abcdef1234567890"
	if ticket != expected {
		t.Fatalf("expected ticket %s, got %s", expected, ticket)
	}
}

func TestExtractTicketFromProtocol_MalformedOrMissing(t *testing.T) {
	cases := []string{
		"",
		"trailguard",
		"ticket.",
		"trailguard, otherprotocol",
	}

	for _, c := range cases {
		_, err := ExtractTicketFromProtocol(c)
		if err != ErrNoTicketProvided {
			t.Fatalf("expected ErrNoTicketProvided for case %q, got: %v", c, err)
		}
	}
}
